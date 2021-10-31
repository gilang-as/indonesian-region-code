const axios = require("axios");
const fs = require('fs');

const Main = async () => {
    try {
        const provinces_sql = []
        const regencies_sql = []
        const districts_sql = []
        const villages_sql = []

        const provinces_json = []
        const regencies_json = []
        const districts_json = []
        const villages_json = []

        const provinces = await axios.get("https://sig.bps.go.id/rest-bridging-dagri/getwilayah?level=provinsi&parent=0")
        for(let p = 0; p < provinces.data.length; p++){
            provinces_sql.push(`(null, "${provinces.data[p].kode_dagri}", "${provinces.data[p].nama_dagri.replace('"', "'")}")`)
            provinces_json.push({id: p+1, code: provinces.data[p].kode_dagri, name: provinces.data[p].nama_dagri.replace('"', "'")})

            const province_dir = `docs/json-split/${provinces.data[p].kode_dagri}/`
            if (!fs.existsSync(province_dir)){
                fs.mkdirSync(province_dir);
            }
            fs.writeFile(province_dir+"index.json", JSON.stringify({
                code: provinces.data[p].kode_dagri,
                name: provinces.data[p].nama_dagri.replace('"', "'")
            }), function (err) {
                if (err) throw err;
            });

            fs.writeFile(`docs/json-single/${provinces.data[p].kode_dagri}.json`, JSON.stringify({
                code: provinces.data[p].kode_dagri,
                name: provinces.data[p].nama_dagri.replace('"', "'")
            }), function (err) {
                if (err) throw err;
            });

            const regencies = await axios.get(`https://sig.bps.go.id/rest-bridging/getwilayah?level=kabupaten&parent=${provinces.data[p].kode_bps}`)
            for(let r = 0; r < regencies.data.length; r++){
                regencies_sql.push(`(null, "${regencies.data[r].kode_dagri.replace(/\./g, "")}", "${provinces.data[p].kode_dagri}", "${regencies.data[r].nama_dagri.replace('"', "'")}")`)
                regencies_json.push({id: r+1, code: regencies.data[r].kode_dagri.replace(/\./g, ""), province_code: provinces.data[p].kode_dagri, name: regencies.data[r].nama_dagri.replace('"', "'")})

                const regency_dir = `${province_dir}/${regencies.data[r].kode_dagri.split(".")[1]}/`
                if (!fs.existsSync(regency_dir)){
                    fs.mkdirSync(regency_dir);
                }
                fs.writeFile(regency_dir+"index.json", JSON.stringify({
                    code: regencies.data[r].kode_dagri.replace(/\./g, ""),
                    province_code: provinces.data[p].kode_dagri,
                    name: regencies.data[r].nama_dagri.replace('"', "'")
                }), function (err) {
                    if (err) throw err;
                });

                fs.writeFile(`docs/json-single/${regencies.data[r].kode_dagri.replace(/\./g, "")}.json`, JSON.stringify({
                    code: regencies.data[r].kode_dagri.replace(/\./g, ""),
                    province_code: provinces.data[p].kode_dagri,
                    name: regencies.data[r].nama_dagri.replace('"', "'")
                }), function (err) {
                    if (err) throw err;
                });

                const districts = await axios.get(`https://sig.bps.go.id/rest-bridging/getwilayah?level=kecamatan&parent=${regencies.data[r].kode_bps}`)
                for(let d = 0; d < districts.data.length; d++){
                    districts_sql.push(`(null, "${districts.data[d].kode_dagri.replace(/\./g, "")}", "${provinces.data[p].kode_dagri}", "${regencies.data[r].kode_dagri.replace(/\./g, "")}", "${districts.data[d].nama_dagri.replace('"', "'")}")`)
                    districts_json.push({id: d+1, code: districts.data[d].kode_dagri.replace(/\./g, ""), province_code: provinces.data[p].kode_dagri, regency_code: regencies.data[r].kode_dagri.replace(/\./g, ""), name: districts.data[d].nama_dagri.replace('"', "'")})

                    const district_dir = `${regency_dir}/${districts.data[d].kode_dagri.split(".")[2]}/`
                    if (!fs.existsSync(district_dir)){
                        fs.mkdirSync(district_dir);
                    }
                    fs.writeFile(district_dir+"index.json", JSON.stringify({
                        code: districts.data[d].kode_dagri.replace(/\./g, ""),
                        province_code: provinces.data[p].kode_dagri,
                        regency_code: regencies.data[r].kode_dagri.replace(/\./g, ""),
                        name: districts.data[d].nama_dagri.replace('"', "'")
                    }), function (err) {
                        if (err) throw err;
                    });

                    fs.writeFile(`docs/json-single/${districts.data[d].kode_dagri.replace(/\./g, "")}.json`, JSON.stringify({
                        code: districts.data[d].kode_dagri.replace(/\./g, ""),
                        province_code: provinces.data[p].kode_dagri,
                        regency_code: regencies.data[r].kode_dagri.replace(/\./g, ""),
                        name: districts.data[d].nama_dagri.replace('"', "'")
                    }), function (err) {
                        if (err) throw err;
                    });

                    const villages = await axios.get(`https://sig.bps.go.id/rest-bridging/getwilayah?level=desa&parent=${districts.data[d].kode_bps}`)
                    for(let v = 0; v < villages.data.length; v++){
                        villages_sql.push(`(null, "${villages.data[v].kode_dagri.replace(/\./g, "")}", "${provinces.data[p].kode_dagri}", "${regencies.data[r].kode_dagri.replace(/\./g, "")}", "${districts.data[d].kode_dagri.replace(/\./g, "")}", "${villages.data[v].nama_dagri.replace('"', "'")}")`)
                        villages_json.push({id: v+1, code: villages.data[v].kode_dagri.replace(/\./g, ""), province_code: provinces.data[p].kode_dagri, regency_code:regencies.data[r].kode_dagri.replace(/\./g, ""), district_code: districts.data[d].kode_dagri.replace(/\./g, ""), name: villages.data[v].nama_dagri.replace('"', "'")})

                        fs.writeFile(district_dir+`${villages.data[v].kode_dagri.split(".")[3]}.json`, JSON.stringify({
                            code: villages.data[v].kode_dagri.replace(/\./g, ""),
                            province_code: provinces.data[p].kode_dagri,
                            regency_code: regencies.data[r].kode_dagri.replace(/\./g, ""),
                            district_code: districts.data[d].kode_dagri.replace(/\./g, ""),
                            name: villages.data[v].nama_dagri.replace('"', "'")
                        }), function (err) {
                            if (err) throw err;
                        });

                        fs.writeFile(`docs/json-single/${villages.data[v].kode_dagri.replace(/\./g, "")}.json`, JSON.stringify({
                            code: villages.data[v].kode_dagri.replace(/\./g, ""),
                            province_code: provinces.data[p].kode_dagri,
                            regency_code: regencies.data[r].kode_dagri.replace(/\./g, ""),
                            district_code: districts.data[d].kode_dagri.replace(/\./g, ""),
                            name: villages.data[v].nama_dagri.replace('"', "'")
                        }), function (err) {
                            if (err) throw err;
                        });

                        setTimeout(function() {
                            console.log(provinces.data[p].nama_dagri.replace('"', "'"), "|", regencies.data[r].nama_dagri.replace('"', "'"), "|", districts.data[d].nama_dagri.replace('"', "'"), "|", villages.data[v].nama_dagri.replace('"', "'"))
                        }, 500);

                    }
                }
            }
        }

        // SQL
        const insert_province_sql = `INSERT INTO master_provinces (id, code, name) values ${provinces_sql.join(",")}`
        fs.writeFile('docs/mysql/provinces.sql', insert_province_sql, function (err) {
            if (err) throw err;
            console.log('Provinces sql file is created successfully.');
        });

        const insert_regency_sql = `INSERT INTO master_regencies (id, code, province_code, name) values ${regencies_sql.join(",")}`
        fs.writeFile('docs/mysql/regencies.sql', insert_regency_sql, function (err) {
            if (err) throw err;
            console.log('Regencies sql file is created successfully.');
        });

        const insert_district_sql = `INSERT INTO master_districts (id, code, province_code, regency_code, name) values ${districts_sql.join(",")}`
        fs.writeFile('docs/mysql/districts.sql', insert_district_sql, function (err) {
            if (err) throw err;
            console.log('Districts sql file is created successfully.');
        });

        const insert_village_sql = `INSERT INTO master_villages (id, code, province_code, regency_code, district_code, name) values ${villages_sql.join(",")}`
        fs.writeFile('docs/mysql/villages.sql', insert_village_sql, function (err) {
            if (err) throw err;
            console.log('Villages sql file is created successfully.');
        });

        // JSON
        fs.writeFile('docs/json-full/provinces.json', JSON.stringify(provinces_json), function (err) {
            if (err) throw err;
            console.log('Provinces JSON file is created successfully.');
        });

        fs.writeFile('docs/json-full/regencies.json', JSON.stringify(regencies_json), function (err) {
            if (err) throw err;
            console.log('Regencies JSON file is created successfully.');
        });

        fs.writeFile('docs/json-full/districts.json', JSON.stringify(districts_json), function (err) {
            if (err) throw err;
            console.log('Districts JSON file is created successfully.');
        });

        fs.writeFile('docs/json-full/villages.json', JSON.stringify(villages_json), function (err) {
            if (err) throw err;
            console.log('Villages JSON file is created successfully.');
        });
    }catch (e) {
        console.log(e)
    }
}

Main();
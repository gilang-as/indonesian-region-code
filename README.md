## Indonesian Region Data (Provinces, Regencies/Cities, Districts, Villages)

## Sample Data
#### Provinces
```json
[
  {
    "id": 1,
    "code": "11",
    "name": "ACEH"
  }
]
```
#### Regencies
```json
[
  {
    "id": 1,
    "code": "1109",
    "province_code": "11",
    "name": "KAB. SIMEULUE"
  }
]
```
#### Districts
```json
[
  {
    "id": 1,
    "code": "110907",
    "regency_code": "1109",
    "province_code": "11",
    "name": "TEUPAH SELATAN"
  }
]
```
#### Villages
```json
[
  {
    "id": 1,
    "code": "1109072008",
    "district_code": "110907",
    "regency_code": "1109",
    "province_code": "11",
    "name": "LATIUNG"
  }
]
```

## Generate New Data
In order to generate new data:
```bash
# Install Packages
npm i
# Run
npm run main.js
```

## Sources
| Data | Source |
|:--------:|:------:|
| Province | https[]()://sig.bps.go.id/rest-bridging-dagri/getwilayah?level=provinsi&parent=0 |
| Regencies/Cities | https[]()://sig.bps.go.id/rest-bridging/getwilayah?level=kabupaten&parent=**{province-id}** |
| Districts | https[]()://sig.bps.go.id/rest-bridging/getwilayah?level=kecamatan&parent=**{regency-id}** |
| Villages | https[]()://sig.bps.go.id/rest-bridging/getwilayah?level=kecamatan&parent=**{district-id}** |

## License

* The scripts are license under: [MIT](LICENSE).
* The source data is attributed to **[Badan Pusat Statistik (BPS) Indonesia](https://sig.bps.go.id/)**.

## Contributing

1. Fork it (https://github.com/gilang-as/indonesian-region/fork).
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.
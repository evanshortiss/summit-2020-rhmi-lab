## Reference Data Generator

This small Node.js script will parse the sample raw data from Los Angeles
APIs into a more compact format we use in the lab.

## Requirements

* Node.js 10+
* npm 6+ (is installed with Node.js 10)

## Usage

Run this command from this folder:

```
npm start
```

It will generate two JSON files, `meter_info.json` and `junction_info.json`. It
will also generate CSV files named `meter_info.json` and `junction_info.json`.

The two CSV files can be copied to the *psql-files/* directory in the
*project-setup* ansible role.

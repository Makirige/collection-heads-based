import pandas as pd

# Remplace par ton URL CSV publiée depuis Google Sheets
google_sheets_csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhnDAU9ikYJXek2v5XzUXTrAoDLkcoCRHOtQ_SkLN25HQMaqauTjxVORKBgP155tWrkIaJiz2Gqfcl/pub?output=csv"

# Charge les données depuis Google Sheets
data = pd.read_csv(google_sheets_csv_url)

# Conversion en JSON
data.to_json('mods.json', orient='records', indent=2, force_ascii=False)

print("✅ mods.json généré avec succès depuis Google Sheets !")

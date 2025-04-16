#!/usr/bin/env python3
"""
Script pour lancer l'application d'édition de Mod Heads
Ce script exécute main.py directement en tant que module Python
"""
import os
import sys
import subprocess

# Obtenir le chemin absolu vers Python 3.13
python_executable = r"C:\Users\zaza-\AppData\Local\Programs\Python\Python313\python.exe"

# Obtenir le chemin absolu vers main.py
current_dir = os.path.dirname(os.path.abspath(__file__))
main_script = os.path.join(current_dir, "__main__.py")

# Créer un fichier __main__.py temporaire qui importe correctement tout
with open(main_script, "w") as f:
    f.write("""
import os
import sys
from PyQt6.QtWidgets import QApplication
from PyQt6.QtGui import QIcon

# Importer les modules directement avec leurs chemins complets
import mod_editor.models.data_model as data_model
import mod_editor.views.main_window as main_window
import mod_editor.controllers.mod_controller as mod_controller

def get_mod_json_path():
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(current_dir, 'mods.json')

def main():
    app = QApplication(sys.argv)
    app.setApplicationName("Éditeur de Mod Heads")
    
    # Création du modèle de données
    model = data_model.ModDataModel(get_mod_json_path())
    
    # Création de la vue principale
    view = main_window.MainWindow()
    
    # Création du contrôleur
    controller = mod_controller.ModController(model, view)
    
    # Connexion des signaux supplémentaires
    view.mod_list.currentRowChanged.connect(controller.on_mod_selected)
    
    # Affichage de la fenêtre principale
    view.show()
    
    # Exécution de l'application
    sys.exit(app.exec())

main()
""")

# Exécuter main.py comme un module Python
try:
    # Aller au répertoire parent pour exécuter le module mod_editor
    os.chdir(os.path.dirname(current_dir))
    
    # Exécuter avec Python en mode module
    subprocess.run([python_executable, "-m", "mod_editor"], check=True)
finally:
    # Nettoyer le fichier temporaire
    if os.path.exists(main_script):
        os.remove(main_script) 
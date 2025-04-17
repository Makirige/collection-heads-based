#!/usr/bin/env python3
"""
Point d'entrée principal de l'application d'édition de Mod Heads
"""
import os
import sys
from PyQt6.QtWidgets import QApplication
from PyQt6.QtGui import QIcon

# Ajout du répertoire courant (backend/) au chemin pour les imports locaux
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from models.data_model import ModDataModel
from views.main_window import MainWindow
from controllers.mod_controller import ModController


def get_mod_json_path():
    """Retourne le chemin vers le fichier mods.json dans le dossier backend"""
    # Le fichier mods.json est maintenant dans le même dossier que ce script
    return os.path.join(current_dir, 'mods.json')


def main():
    """Fonction principale de l'application"""
    app = QApplication(sys.argv)
    app.setApplicationName("Éditeur de Mod Heads")
    
    # Création du modèle de données
    model = ModDataModel(get_mod_json_path())
    
    # Création de la vue principale
    view = MainWindow()
    
    # Création du contrôleur
    controller = ModController(model, view)
    
    # Connexion des signaux supplémentaires
    view.mod_list.currentRowChanged.connect(controller.on_mod_selected)
    
    # Affichage de la fenêtre principale
    view.show()
    
    # Exécution de l'application
    sys.exit(app.exec())


if __name__ == "__main__":
    main() 
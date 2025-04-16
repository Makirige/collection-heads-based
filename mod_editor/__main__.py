"""
Point d'entrée principal de l'application quand exécutée comme un module
"""
import os
import sys
from PyQt6.QtWidgets import QApplication
from PyQt6.QtGui import QIcon

# Ajout du répertoire parent au chemin Python
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Chemin vers mods.json
def get_mod_json_path():
    return os.path.join(parent_dir, 'mods.json')

def main():
    """Fonction principale de l'application"""
    # Import ici pour éviter les problèmes d'importation circulaire
    from mod_editor.models.data_model import ModDataModel
    from mod_editor.views.main_window import MainWindow
    from mod_editor.controllers.mod_controller import ModController
    
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
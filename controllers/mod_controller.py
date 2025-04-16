"""
Module définissant le contrôleur principal de l'application
"""
from PyQt6.QtWidgets import QMessageBox

from models.data_model import ModDataModel, ModEntry
from views.main_window import MainWindow
from views.mod_editor import ModEditorDialog


class ModController:
    """Contrôleur de l'application d'édition de mods"""
    
    def __init__(self, model: ModDataModel, view: MainWindow):
        self.model = model
        self.view = view
        
        # Connexion des signaux de la vue
        self.view.add_mod_requested.connect(self.add_mod)
        self.view.edit_mod_requested.connect(self.edit_mod)
        
        # Mise à jour de la liste avec les mods actuels
        self.refresh_mod_list()
        
    def refresh_mod_list(self):
        """Rafraîchit la liste des mods dans la vue"""
        self.view.populate_mod_list(self.model.mods)
        
    def on_mod_selected(self, index: int):
        """Gère la sélection d'un mod dans la liste"""
        mod = self.model.get_mod(index)
        if mod:
            self.view.update_mod_details(mod)
            
    def add_mod(self):
        """Ouvre le formulaire d'ajout de mod"""
        dialog = ModEditorDialog(self.view)
        result = dialog.exec()
        
        if result:
            mod = dialog.get_mod_data()
            if mod:
                success = self.model.add_mod(mod)
                if success:
                    self.refresh_mod_list()
                    self.save_mods()
                    QMessageBox.information(
                        self.view,
                        "Succès",
                        "Le mod a été ajouté avec succès."
                    )
                else:
                    QMessageBox.warning(
                        self.view,
                        "Erreur",
                        "Impossible d'ajouter le mod. Vérifiez que toutes les informations sont valides."
                    )
                    
    def edit_mod(self, index: int):
        """Ouvre le formulaire d'édition de mod"""
        mod = self.model.get_mod(index)
        if not mod:
            return
            
        dialog = ModEditorDialog(self.view, mod)
        result = dialog.exec()
        
        if result:
            updated_mod = dialog.get_mod_data()
            if updated_mod:
                success = self.model.update_mod(index, updated_mod)
                if success:
                    self.refresh_mod_list()
                    self.view.mod_list.setCurrentRow(index)
                    self.save_mods()
                    QMessageBox.information(
                        self.view,
                        "Succès",
                        "Le mod a été mis à jour avec succès."
                    )
                else:
                    QMessageBox.warning(
                        self.view,
                        "Erreur",
                        "Impossible de mettre à jour le mod. Vérifiez que toutes les informations sont valides."
                    )
                    
    def delete_mod(self, index: int):
        """Supprime un mod"""
        success = self.model.delete_mod(index)
        if success:
            self.refresh_mod_list()
            self.save_mods()
            QMessageBox.information(
                self.view,
                "Succès",
                "Le mod a été supprimé avec succès."
            )
        else:
            QMessageBox.warning(
                self.view,
                "Erreur",
                "Impossible de supprimer le mod."
            )
            
    def save_mods(self):
        """Sauvegarde les mods dans le fichier JSON"""
        success = self.model.save()
        if not success:
            QMessageBox.warning(
                self.view,
                "Erreur",
                "Impossible de sauvegarder les modifications."
            )
            
    def reload_mods(self):
        """Recharge les mods à partir du fichier JSON"""
        success = self.model.load()
        if success:
            self.refresh_mod_list()
            QMessageBox.information(
                self.view,
                "Succès",
                "Les mods ont été rechargés avec succès."
            )
        else:
            QMessageBox.warning(
                self.view,
                "Erreur",
                "Impossible de recharger les mods."
            )
            
    def filter_mods(self, filter_type: str, filter_value: str):
        """Filtre les mods selon les critères"""
        if not filter_value.strip():
            self.refresh_mod_list()
            return
            
        filtered_mods = []
        
        if filter_type == "Par ID":
            filtered_mods = self.model.find_mods_by_id(filter_value)
        elif filter_type == "Par Race":
            filtered_mods = self.model.find_mods_by_race(filter_value)
        else:
            # Filtre "Tous" ou non reconnu
            self.refresh_mod_list()
            return
            
        self.view.populate_mod_list(filtered_mods) 
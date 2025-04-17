"""
Module définissant le formulaire d'édition de mod
"""
from PyQt6.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
                           QLineEdit, QComboBox, QPushButton, QLabel,
                           QFileDialog, QMessageBox)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QPixmap

from models.data_model import ModEntry


class ModEditorDialog(QDialog):
    """Dialogue d'édition de mod"""
    
    def __init__(self, parent=None, mod=None):
        super().__init__(parent)
        self.mod = mod
        self.is_edit_mode = mod is not None
        
        self.setWindowTitle("Éditer un mod" if self.is_edit_mode else "Ajouter un mod")
        self.resize(600, 500)
        
        self.setup_ui()
        
        if self.is_edit_mode:
            self.populate_form()
        
    def setup_ui(self):
        """Configure l'interface utilisateur"""
        layout = QVBoxLayout(self)
        
        form_layout = QFormLayout()
        
        # ID et Nom
        self.id_input = QLineEdit()
        self.name_input = QLineEdit()
        self.display_name_input = QLineEdit()
        
        form_layout.addRow("ID:", self.id_input)
        form_layout.addRow("Nom:", self.name_input)
        form_layout.addRow("Nom d'affichage:", self.display_name_input)
        
        # Race et Body Type
        self.race_combo = QComboBox()
        self.race_combo.addItems(["human", "elf", "half-elf", "dwarf", "halfling", "tiefling", "drow"])
        
        self.body_type_combo = QComboBox()
        self.body_type_combo.addItems(["bt1", "bt2", "bt3", "bt4"])
        
        form_layout.addRow("Race:", self.race_combo)
        form_layout.addRow("Type de corps:", self.body_type_combo)
        
        # Image
        image_layout = QHBoxLayout()
        self.image_path_input = QLineEdit()
        self.browse_image_button = QPushButton("Parcourir...")
        self.browse_image_button.clicked.connect(self.on_browse_image)
        
        image_layout.addWidget(self.image_path_input)
        image_layout.addWidget(self.browse_image_button)
        
        form_layout.addRow("Chemin de l'image:", image_layout)
        
        # Aperçu de l'image
        self.image_preview = QLabel()
        self.image_preview.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.image_preview.setMinimumSize(200, 200)
        self.image_preview.setMaximumSize(300, 300)
        self.image_preview.setScaledContents(True)
        
        # URL de téléchargement
        self.download_url_input = QLineEdit()
        form_layout.addRow("URL de téléchargement:", self.download_url_input)
        
        # Boutons
        button_layout = QHBoxLayout()
        self.ok_button = QPushButton("OK")
        self.cancel_button = QPushButton("Annuler")
        
        self.ok_button.clicked.connect(self.accept)
        self.cancel_button.clicked.connect(self.reject)
        
        button_layout.addWidget(self.ok_button)
        button_layout.addWidget(self.cancel_button)
        
        # Layout final
        layout.addLayout(form_layout)
        layout.addWidget(self.image_preview)
        layout.addLayout(button_layout)
        
        # Connexion des signaux
        self.image_path_input.textChanged.connect(self.update_image_preview)
        
    def populate_form(self):
        """Remplit le formulaire avec les données du mod"""
        if not self.mod:
            return
            
        self.id_input.setText(self.mod.id)
        self.name_input.setText(self.mod.name)
        self.display_name_input.setText(self.mod.display_name)
        
        # Retrouver l'index de la race dans la liste
        race_index = self.race_combo.findText(self.mod.race)
        if race_index >= 0:
            self.race_combo.setCurrentIndex(race_index)
            
        # Retrouver l'index du body type dans la liste
        body_type_index = self.body_type_combo.findText(self.mod.body_type)
        if body_type_index >= 0:
            self.body_type_combo.setCurrentIndex(body_type_index)
            
        self.image_path_input.setText(self.mod.image_path)
        self.download_url_input.setText(self.mod.download_url)
        
    def update_image_preview(self):
        """Met à jour l'aperçu de l'image"""
        image_path = self.image_path_input.text().strip()
        if image_path:
            pixmap = QPixmap(image_path)
            if not pixmap.isNull():
                self.image_preview.setPixmap(pixmap)
            else:
                self.image_preview.setText("Image non disponible")
        else:
            self.image_preview.clear()
            
    def on_browse_image(self):
        """Ouvre un dialogue pour sélectionner une image"""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Sélectionner une image",
            "",
            "Images (*.png *.jpg *.jpeg *.bmp *.webp)"
        )
        
        if file_path:
            self.image_path_input.setText(file_path)
            
    def get_mod_data(self):
        """Récupère les données du formulaire et crée un objet ModEntry"""
        # Validation de base
        if not self.id_input.text().strip():
            QMessageBox.warning(self, "Validation", "L'ID est obligatoire.")
            return None
            
        if not self.name_input.text().strip():
            QMessageBox.warning(self, "Validation", "Le nom est obligatoire.")
            return None
            
        if not self.display_name_input.text().strip():
            QMessageBox.warning(self, "Validation", "Le nom d'affichage est obligatoire.")
            return None
            
        # Création du dictionnaire de données
        data = {
            'id': self.id_input.text().strip(),
            'name': self.name_input.text().strip(),
            'displayName': self.display_name_input.text().strip(),
            'race': self.race_combo.currentText(),
            'bodyType': self.body_type_combo.currentText(),
            'imagePath': self.image_path_input.text().strip(),
            'downloadUrl': self.download_url_input.text().strip()
        }
        
        return ModEntry(data) 
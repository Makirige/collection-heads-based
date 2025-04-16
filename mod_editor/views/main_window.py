"""
Module définissant la fenêtre principale de l'application
"""
from PyQt6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                           QListWidget, QListWidgetItem, QPushButton, 
                           QLabel, QSplitter, QMessageBox, QFileDialog,
                           QGroupBox, QFormLayout, QLineEdit, QComboBox)
from PyQt6.QtCore import Qt, pyqtSignal, QSize
from PyQt6.QtGui import QPixmap, QIcon

from ..models.data_model import ModEntry


class ModDetailsWidget(QWidget):
    """Widget affichant les détails d'un mod"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
        
    def setup_ui(self):
        """Configure l'interface utilisateur"""
        layout = QVBoxLayout(self)
        
        # Groupbox pour les informations
        info_group = QGroupBox("Informations du Mod")
        form_layout = QFormLayout()
        
        self.id_label = QLabel()
        self.name_label = QLabel()
        self.display_name_label = QLabel()
        self.race_label = QLabel()
        self.body_type_label = QLabel()
        self.download_url_label = QLabel()
        self.download_url_label.setTextInteractionFlags(Qt.TextInteractionFlag.TextSelectableByMouse)
        self.download_url_label.setWordWrap(True)
        
        form_layout.addRow("ID:", self.id_label)
        form_layout.addRow("Nom:", self.name_label)
        form_layout.addRow("Nom d'affichage:", self.display_name_label)
        form_layout.addRow("Race:", self.race_label)
        form_layout.addRow("Type de corps:", self.body_type_label)
        form_layout.addRow("URL de téléchargement:", self.download_url_label)
        
        info_group.setLayout(form_layout)
        
        # Image preview
        image_group = QGroupBox("Aperçu de l'image")
        image_layout = QVBoxLayout()
        self.image_label = QLabel()
        self.image_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.image_label.setMinimumSize(200, 200)
        image_layout.addWidget(self.image_label)
        image_group.setLayout(image_layout)
        
        layout.addWidget(info_group)
        layout.addWidget(image_group)
        layout.addStretch()
        
    def update_details(self, mod: ModEntry):
        """Met à jour l'affichage avec les détails du mod"""
        self.id_label.setText(mod.id)
        self.name_label.setText(mod.name)
        self.display_name_label.setText(mod.display_name)
        self.race_label.setText(mod.race)
        self.body_type_label.setText(mod.body_type)
        self.download_url_label.setText(mod.download_url)
        
        # Chargement de l'image
        pixmap = QPixmap(mod.image_path)
        if not pixmap.isNull():
            pixmap = pixmap.scaled(200, 200, Qt.AspectRatioMode.KeepAspectRatio)
            self.image_label.setPixmap(pixmap)
        else:
            self.image_label.setText("Image non disponible")
            
    def clear(self):
        """Efface les détails affichés"""
        self.id_label.clear()
        self.name_label.clear()
        self.display_name_label.clear()
        self.race_label.clear()
        self.body_type_label.clear()
        self.download_url_label.clear()
        self.image_label.clear()


class MainWindow(QMainWindow):
    """Fenêtre principale de l'application"""
    
    edit_mod_requested = pyqtSignal(int)
    add_mod_requested = pyqtSignal()
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Éditeur de Mod Heads")
        self.resize(900, 600)
        self.setup_ui()
        
    def setup_ui(self):
        """Configure l'interface utilisateur"""
        central_widget = QWidget()
        main_layout = QHBoxLayout(central_widget)
        
        # Splitter pour diviser la liste et les détails
        splitter = QSplitter(Qt.Orientation.Horizontal)
        
        # Panneau de gauche avec la liste et les boutons
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        
        # Widgets de filtrage
        filter_layout = QHBoxLayout()
        self.filter_combo = QComboBox()
        self.filter_combo.addItems(["Tous", "Par ID", "Par Race"])
        self.filter_input = QLineEdit()
        self.filter_input.setPlaceholderText("Filtre...")
        self.filter_button = QPushButton("Filtrer")
        self.filter_button.clicked.connect(self.apply_filter)
        
        filter_layout.addWidget(self.filter_combo)
        filter_layout.addWidget(self.filter_input)
        filter_layout.addWidget(self.filter_button)
        
        # Liste de mods
        self.mod_list = QListWidget()
        self.mod_list.setMinimumWidth(300)
        self.mod_list.currentRowChanged.connect(self.on_mod_selected)
        
        # Boutons d'action
        button_layout = QHBoxLayout()
        self.add_button = QPushButton("Ajouter")
        self.edit_button = QPushButton("Modifier")
        self.delete_button = QPushButton("Supprimer")
        
        self.add_button.clicked.connect(self.add_mod_requested)
        self.edit_button.clicked.connect(self.on_edit_button_clicked)
        self.delete_button.clicked.connect(self.on_delete_button_clicked)
        
        button_layout.addWidget(self.add_button)
        button_layout.addWidget(self.edit_button)
        button_layout.addWidget(self.delete_button)
        
        left_layout.addLayout(filter_layout)
        left_layout.addWidget(self.mod_list)
        left_layout.addLayout(button_layout)
        
        # Panneau de droite avec les détails
        self.details_widget = ModDetailsWidget()
        
        # Ajout des panneaux au splitter
        splitter.addWidget(left_panel)
        splitter.addWidget(self.details_widget)
        splitter.setSizes([300, 600])
        
        main_layout.addWidget(splitter)
        self.setCentralWidget(central_widget)
        
        # Barre de menu
        self.setup_menu()
        
    def setup_menu(self):
        """Configure la barre de menu"""
        menu_bar = self.menuBar()
        
        # Menu Fichier
        file_menu = menu_bar.addMenu("Fichier")
        
        save_action = file_menu.addAction("Sauvegarder")
        save_action.triggered.connect(self.on_save)
        
        reload_action = file_menu.addAction("Recharger")
        reload_action.triggered.connect(self.on_reload)
        
        file_menu.addSeparator()
        
        exit_action = file_menu.addAction("Quitter")
        exit_action.triggered.connect(self.close)
        
    def populate_mod_list(self, mods):
        """Remplit la liste des mods"""
        self.mod_list.clear()
        self.details_widget.clear()
        
        for mod in mods:
            item = QListWidgetItem(mod.display_name)
            item.setToolTip(f"ID: {mod.id}, Race: {mod.race}")
            self.mod_list.addItem(item)
            
    def on_mod_selected(self, index):
        """Gère la sélection d'un mod dans la liste"""
        if index >= 0:
            # Signal à émettre pour que le contrôleur récupère le mod
            self.selected_index = index
        else:
            self.details_widget.clear()
            self.selected_index = -1
            
    def update_mod_details(self, mod):
        """Met à jour l'affichage des détails du mod"""
        if mod:
            self.details_widget.update_details(mod)
            
    def on_edit_button_clicked(self):
        """Gère le clic sur le bouton Modifier"""
        if hasattr(self, 'selected_index') and self.selected_index >= 0:
            self.edit_mod_requested.emit(self.selected_index)
        else:
            QMessageBox.warning(self, "Attention", "Veuillez sélectionner un mod à modifier.")
            
    def on_delete_button_clicked(self):
        """Gère le clic sur le bouton Supprimer"""
        if hasattr(self, 'selected_index') and self.selected_index >= 0:
            reply = QMessageBox.question(
                self, 
                "Confirmation", 
                "Êtes-vous sûr de vouloir supprimer ce mod ?",
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
            )
            
            if reply == QMessageBox.StandardButton.Yes:
                # Signal à émettre pour que le contrôleur supprime le mod
                pass
        else:
            QMessageBox.warning(self, "Attention", "Veuillez sélectionner un mod à supprimer.")
            
    def on_save(self):
        """Gère l'action de sauvegarde"""
        # Signal à émettre pour que le contrôleur sauvegarde les données
        pass
        
    def on_reload(self):
        """Gère l'action de rechargement"""
        # Signal à émettre pour que le contrôleur recharge les données
        pass
        
    def apply_filter(self):
        """Applique le filtre à la liste des mods"""
        # Signal à émettre pour que le contrôleur filtre les données
        filter_type = self.filter_combo.currentText()
        filter_value = self.filter_input.text().strip()
        
        # Les signaux seront connectés dans le contrôleur 
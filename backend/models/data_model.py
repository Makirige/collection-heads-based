# Ce fichier doit contenir la classe ModDataModel
# Le contenu original se trouvait dans mod_editor/models/data_model.py

"""
Module pour la gestion des données de mods
"""
import json
import os
from typing import List, Dict, Any, Optional

class ModEntry:
    """Classe représentant une entrée de mod"""
    
    def __init__(self, data: Dict[str, Any]):
        self.id = data.get('id', '')
        self.name = data.get('name', '')
        self.display_name = data.get('displayName', '')
        self.race = data.get('race', '')
        self.body_type = data.get('bodyType', '')
        self.image_path = data.get('imagePath', '')
        self.download_url = data.get('downloadUrl', '')
        self.info_link = data.get('infoLink', '')
        
    def to_dict(self) -> Dict[str, Any]:
        """Convertit l'objet en dictionnaire pour le JSON"""
        return {
            'id': self.id,
            'name': self.name,
            'displayName': self.display_name,
            'race': self.race,
            'bodyType': self.body_type,
            'imagePath': self.image_path,
            'downloadUrl': self.download_url,
            'infoLink': self.info_link
        }
    
    @property
    def is_valid(self) -> bool:
        """Vérifie si toutes les propriétés obligatoires sont définies"""
        return (self.id and self.name and self.display_name 
                and self.race and self.body_type)


class ModDataModel:
    """Modèle de données pour gérer la collection de mods"""
    
    def __init__(self, file_path: str = None):
        # REMARQUE: La logique de chemin par défaut a été ajustée dans main.py
        # pour pointer vers backend/mods.json. Le file_path fourni par 
        # main.py sera le bon.
        if file_path is None:
             # Cette logique est probablement obsolète car main.py fournit le chemin
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.file_path = os.path.join(current_dir, '..', 'mods.json') # Hypothèse chemin relatif
        else:
            self.file_path = file_path
            
        self.mods: List[ModEntry] = []
        self.load()
        
    def load(self) -> bool:
        """Charge les données à partir du fichier JSON"""
        try:
            if os.path.exists(self.file_path):
                with open(self.file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.mods = [ModEntry(item) for item in data]
                return True
            print(f"Warning: Mod file not found at {self.file_path}")
            return False
        except Exception as e:
            print(f"Erreur lors du chargement des données depuis {self.file_path}: {e}")
            return False
            
    def save(self) -> bool:
        """Sauvegarde les données dans le fichier JSON"""
        try:
            data = [mod.to_dict() for mod in self.mods]
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Erreur lors de la sauvegarde des données vers {self.file_path}: {e}")
            return False
    
    def add_mod(self, mod: ModEntry) -> bool:
        """Ajoute un nouveau mod à la collection"""
        if not mod.is_valid:
            print(f"Tentative d'ajout d'un mod invalide: {mod.to_dict()}")
            return False
        self.mods.append(mod)
        return True
        
    def update_mod(self, index: int, mod: ModEntry) -> bool:
        """Met à jour un mod existant"""
        if not mod.is_valid or index < 0 or index >= len(self.mods):
            print(f"Tentative de mise à jour invalide (index: {index}, mod valide: {mod.is_valid})")
            return False
        self.mods[index] = mod
        return True
        
    def delete_mod(self, index: int) -> bool:
        """Supprime un mod de la collection"""
        if index < 0 or index >= len(self.mods):
            print(f"Tentative de suppression d'un index invalide: {index}")
            return False
        del self.mods[index]
        return True
    
    def get_mod(self, index: int) -> Optional[ModEntry]:
        """Récupère un mod par son index"""
        if index < 0 or index >= len(self.mods):
            return None
        return self.mods[index]
    
    def find_mods_by_id(self, mod_id: str) -> List[ModEntry]:
        """Trouve tous les mods avec l'ID spécifié"""
        return [mod for mod in self.mods if mod.id == mod_id]
    
    def find_mods_by_race(self, race: str) -> List[ModEntry]:
        """Trouve tous les mods avec la race spécifiée"""
        return [mod for mod in self.mods if mod.race == race]

    # Implémentation à restaurer
    pass 
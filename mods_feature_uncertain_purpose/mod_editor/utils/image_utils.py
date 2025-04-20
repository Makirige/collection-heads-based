"""
Module d'utilitaires pour la gestion des images
"""
import os
import shutil
from typing import Tuple, Optional
from PyQt6.QtGui import QPixmap, QImage


def is_valid_image_path(path: str) -> bool:
    """Vérifie si le chemin d'image est valide"""
    if not path:
        return False
        
    if not os.path.exists(path):
        return False
        
    # Vérification de l'extension
    _, ext = os.path.splitext(path)
    valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    
    return ext.lower() in valid_extensions


def copy_image_to_images_folder(source_path: str, target_name: str) -> Optional[str]:
    """
    Copie une image vers le dossier images et retourne le chemin relatif
    
    Args:
        source_path: Chemin source de l'image
        target_name: Nom cible de l'image
        
    Returns:
        Le chemin relatif de l'image copiée ou None en cas d'erreur
    """
    if not is_valid_image_path(source_path):
        return None
    
    # Création du dossier images s'il n'existe pas
    os.makedirs('images', exist_ok=True)
    
    # Extension du fichier
    _, ext = os.path.splitext(source_path)
    
    # Nom du fichier cible
    target_filename = f"{target_name}{ext}"
    target_path = os.path.join('images', target_filename)
    
    try:
        shutil.copy2(source_path, target_path)
        return os.path.normpath(target_path)
    except Exception as e:
        print(f"Erreur lors de la copie de l'image: {e}")
        return None


def resize_image(image_path: str, max_width: int, max_height: int) -> Optional[Tuple[int, int]]:
    """
    Redimensionne une image tout en conservant ses proportions
    
    Args:
        image_path: Chemin de l'image
        max_width: Largeur maximale
        max_height: Hauteur maximale
        
    Returns:
        Un tuple (largeur, hauteur) de la nouvelle taille ou None en cas d'erreur
    """
    if not is_valid_image_path(image_path):
        return None
    
    pixmap = QPixmap(image_path)
    if pixmap.isNull():
        return None
    
    # Obtenir les dimensions actuelles
    width = pixmap.width()
    height = pixmap.height()
    
    # Calculer les nouvelles dimensions en conservant les proportions
    if width > max_width or height > max_height:
        aspect_ratio = width / height
        
        if width > height:
            new_width = max_width
            new_height = int(new_width / aspect_ratio)
        else:
            new_height = max_height
            new_width = int(new_height * aspect_ratio)
        
        # Redimensionner l'image
        pixmap = pixmap.scaled(new_width, new_height)
        
        # Sauvegarder l'image redimensionnée
        pixmap.save(image_path)
        
        return (new_width, new_height)
    
    return (width, height) 
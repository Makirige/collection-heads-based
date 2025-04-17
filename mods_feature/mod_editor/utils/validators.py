"""
Module de validation des entrées utilisateur
"""
import re
import os
from urllib.parse import urlparse


def validate_id(value: str) -> bool:
    """
    Valide un identifiant
    
    Rules:
    - Non vide
    - Uniquement des lettres, chiffres, tirets et underscores
    - Au moins 1 caractère
    """
    if not value:
        return False
        
    pattern = r'^[a-zA-Z0-9_-]+$'
    return bool(re.match(pattern, value))


def validate_name(value: str) -> bool:
    """
    Valide un nom
    
    Rules:
    - Non vide
    - Uniquement des lettres, chiffres, tirets, underscores et espaces
    - Au moins 1 caractère
    """
    if not value:
        return False
        
    pattern = r'^[a-zA-Z0-9_\- ]+$'
    return bool(re.match(pattern, value))


def validate_display_name(value: str) -> bool:
    """
    Valide un nom d'affichage
    
    Rules:
    - Non vide
    - Peut contenir n'importe quel caractère imprimable
    - Au moins 1 caractère
    """
    return bool(value and value.strip())


def validate_race(value: str, valid_races: list = None) -> bool:
    """
    Valide une race
    
    Args:
        value: Valeur à valider
        valid_races: Liste des races valides
    """
    if not value:
        return False
        
    if valid_races:
        return value in valid_races
        
    # Races par défaut
    default_races = ["human", "elf", "half-elf", "dwarf", "halfling", "tiefling", "drow"]
    return value in default_races


def validate_body_type(value: str, valid_types: list = None) -> bool:
    """
    Valide un type de corps
    
    Args:
        value: Valeur à valider
        valid_types: Liste des types valides
    """
    if not value:
        return False
        
    if valid_types:
        return value in valid_types
        
    # Types par défaut
    default_types = ["bt1", "bt2", "bt3", "bt4"]
    return value in default_types


def validate_image_path(value: str) -> bool:
    """
    Valide un chemin d'image
    
    Rules:
    - Non vide
    - L'extension est une image (.jpg, .png, etc.)
    - Le fichier existe
    """
    if not value:
        return False
        
    # Vérifier si le fichier existe
    if not os.path.exists(value):
        return False
        
    # Vérifier l'extension
    _, ext = os.path.splitext(value)
    valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    
    return ext.lower() in valid_extensions


def validate_url(value: str) -> bool:
    """
    Valide une URL
    
    Rules:
    - Doit être une URL valide
    - Doit avoir un schéma (http, https, etc.)
    - Doit avoir un domaine
    """
    if not value:
        return True  # URL facultative
        
    try:
        result = urlparse(value)
        return all([result.scheme, result.netloc])
    except:
        return False 
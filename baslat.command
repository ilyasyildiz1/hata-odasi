#!/bin/bash
# Hata Odası'nı yerel sunucuda başlatır ve tarayıcıda açar. (Çift tıklayarak çalıştırın.)
cd "$(dirname "$0")"
python3 sunucu.py 5173 --ac

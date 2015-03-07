#! /usr/bin/env python
# coding: utf-8

# open sqlite

# add a record

import sqlite3
conn = sqlite3.connect('sonna.db')
cur = conn.cursor()
cur.execute('''CREATE TABLE ahadith
             (date text, trans text, symbol text, qty real, price real)''')
t = ()
cur.execute("INSERT INTO stocks VALUES (?, ?, ?, ?)")
conn.commit()

conn.close()

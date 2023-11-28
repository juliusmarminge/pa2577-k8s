import os
import mysql.connector


class MySQLConnection:
    """Context manager for MySQL connections."""

    def __init__(self):
        self.host = os.environ.get("MYSQL_HOST") or "localhost"
        self.user = os.environ.get("MYSQL_USER") or "root"
        self.password = os.environ.get("MYSQL_PASSWORD") or ""
        self.database = os.environ.get("MYSQL_DATABASE") or "default"
        self.conn = None
        self.cursor = None

    def __enter__(self):
        self.conn = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )
        self.cursor = self.conn.cursor()
        return self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.commit()
            self.conn.close()

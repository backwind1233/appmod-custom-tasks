// After: Azure PostgreSQL Database Connection
package com.example.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class UserRepository {
    
    // Azure PostgreSQL connection URL format
    private static final String JDBC_URL = "jdbc:postgresql://myserver.postgres.database.azure.com:5432/mydb";
    private static final String USERNAME = "adminuser@myserver";
    private static final String PASSWORD = System.getenv("AZURE_POSTGRESQL_PASSWORD");
    
    public UserRepository() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("PostgreSQL driver not found", e);
        }
    }
    
    public Connection getConnection() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", USERNAME);
        props.setProperty("password", PASSWORD);
        props.setProperty("sslmode", "require"); // Required for Azure PostgreSQL
        
        return DriverManager.getConnection(JDBC_URL, props);
    }
    
    public List<User> findAllUsers() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id, name, email FROM users LIMIT 100";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                users.add(user);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch users", e);
        }
        return users;
    }
}

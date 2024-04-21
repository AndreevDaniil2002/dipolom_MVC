package ru.locate.garbage.server.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Table(name="User")
public class MyUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name= "id")

    private Long id;

    @Column(unique = true, name = "name")
    private String name;

    @Column(name= "password")
    private String password;

    @Column(name= "role", nullable = true)
    private Roles role;
}

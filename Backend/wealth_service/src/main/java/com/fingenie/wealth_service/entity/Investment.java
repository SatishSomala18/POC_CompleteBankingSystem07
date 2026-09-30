package com.fingenie.wealth_service.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;      
    private String riskLevel;   

    @OneToMany(mappedBy = "investment", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UserInvestment> users;

    public Investment() {}

    public Investment(String type, String riskLevel) {
        this.type = type;
        this.riskLevel = riskLevel;
    }

    public Long getId() { return id; }
    public String getType() { return type; }
    public String getRiskLevel() { return riskLevel; }

    public void setId(Long id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public List<UserInvestment> getUsers() { return users; }
    public void setUsers(List<UserInvestment> users) { this.users = users; }




}
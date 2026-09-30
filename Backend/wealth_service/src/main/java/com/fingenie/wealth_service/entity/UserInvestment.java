package com.fingenie.wealth_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_investments")
public class UserInvestment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;   
    private Long accountId;
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "investment_id")
    @JsonBackReference
    private Investment investment;

    public UserInvestment() {}

	public UserInvestment(Long id, Long userId, Long accountId, Double amount, Investment investment) {
		super();
		this.id = id;
		this.userId = userId;
		this.accountId = accountId;
		this.amount = amount;
		this.investment = investment;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Investment getInvestment() {
		return investment;
	}

	public void setInvestment(Investment investment) {
		this.investment = investment;
	}

	@Override
	public String toString() {
		return "UserInvestment [id=" + id + ", userId=" + userId + ", accountId=" + accountId + ", amount=" + amount
				+ ", investment=" + investment + "]";
	}

    

}

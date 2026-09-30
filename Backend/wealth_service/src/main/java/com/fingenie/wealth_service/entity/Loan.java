package com.fingenie.wealth_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
public class Loan {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Double amount;
	private int tenureMonths;
	private String status;
	private Double emi;
	private Long accountId;
	private Long userId;
	private LocalDateTime lastEmiPaidDate;
	private boolean delinquent;

	public Loan() {
	}

	public Loan(Long id, Double amount, int tenureMonths, String status, Double emi, Long accountId, Long userId) {
		super();
		this.id = id;
		this.amount = amount;
		this.tenureMonths = tenureMonths;
		this.status = status;
		this.emi = emi;
		this.accountId = accountId;
		this.userId = userId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public int getTenureMonths() {
		return tenureMonths;
	}

	public void setTenureMonths(int tenureMonths) {
		this.tenureMonths = tenureMonths;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Double getEmi() {
		return emi;
	}

	public void setEmi(Double emi) {
		this.emi = emi;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public LocalDateTime getLastEmiPaidDate() {
		return lastEmiPaidDate;
	}

	public void setLastEmiPaidDate(LocalDateTime lastEmiPaidDate) {
		this.lastEmiPaidDate = lastEmiPaidDate;
	}

	public boolean isDelinquent() {
		return delinquent;
	}

	public void setDelinquent(boolean delinquent) {
		this.delinquent = delinquent;
	}

	@Override
	public String toString() {
		return "Loan [id=" + id + ", amount=" + amount + ", tenureMonths=" + tenureMonths + ", status=" + status
				+ ", emi=" + emi + ", accountId=" + accountId + ", userId=" + userId + ", delinquent=" + delinquent
				+ "]";
	}

}
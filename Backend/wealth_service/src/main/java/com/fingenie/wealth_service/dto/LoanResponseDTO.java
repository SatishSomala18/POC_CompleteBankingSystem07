package com.fingenie.wealth_service.dto;

import java.time.LocalDateTime;

public class LoanResponseDTO {

	private Long loanId;
	private Long userId;
	private Long accountId;
	private String name;
	private int creditScore;
	private Double amount;
	private int tenureMonths;
	private Double emi;
	private String status;
	private LocalDateTime lastEmiPaidDate;
	private boolean delinquent;
	private long overdueDays;

	public LoanResponseDTO() {

	}

	public LoanResponseDTO(Long loanId, Long userId, Long accountId, String name, int creditScore, Double amount,
			int tenureMonths, Double emi, String status) {
		super();
		this.loanId = loanId;
		this.userId = userId;
		this.accountId = accountId;
		this.name = name;
		this.creditScore = creditScore;
		this.amount = amount;
		this.tenureMonths = tenureMonths;
		this.emi = emi;
		this.status = status;
	}

	public Long getLoanId() {
		return loanId;
	}

	public void setLoanId(Long loanId) {
		this.loanId = loanId;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getCreditScore() {
		return creditScore;
	}

	public void setCreditScore(int creditScore) {
		this.creditScore = creditScore;
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

	public Double getEmi() {
		return emi;
	}

	public void setEmi(Double emi) {
		this.emi = emi;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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

	public long getOverdueDays() {
		return overdueDays;
	}

	public void setOverdueDays(long overdueDays) {
		this.overdueDays = overdueDays;
	}

	@Override
	public String toString() {
		return "LoanResponseDTO [loanId=" + loanId + ", userId=" + userId + ", accountId=" + accountId + ", name="
				+ name + ", creditScore=" + creditScore + ", amount=" + amount + ", tenureMonths=" + tenureMonths
				+ ", emi=" + emi + ", status=" + status + ", delinquent=" + delinquent + "]";
	}

}
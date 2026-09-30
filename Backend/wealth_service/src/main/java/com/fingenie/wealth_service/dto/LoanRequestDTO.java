package com.fingenie.wealth_service.dto;

public class LoanRequestDTO {

	private Double amount;
	private int tenureMonths;
	private Long accountId;

	public LoanRequestDTO() {

	}

	public LoanRequestDTO(Double amount, int tenureMonths, Long accountId) {
		super();
		this.amount = amount;
		this.tenureMonths = tenureMonths;
		this.accountId = accountId;
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

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	@Override
	public String toString() {
		return "LoanRequestDTO [amount=" + amount + ", tenureMonths=" + tenureMonths + ", accountId=" + accountId + "]";
	}

}
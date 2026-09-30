package com.fingenie.wealth_service.dto;

public class UserInvestmentRequestDTO {

    private Long accountId;
    private Long investmentId;
    private Double amount;

    public UserInvestmentRequestDTO() {}

	public UserInvestmentRequestDTO(Long accountId, Long investmentId, Double amount) {
		super();
		this.accountId = accountId;
		this.investmentId = investmentId;
		this.amount = amount;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public Long getInvestmentId() {
		return investmentId;
	}

	public void setInvestmentId(Long investmentId) {
		this.investmentId = investmentId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	@Override
	public String toString() {
		return "UserInvestmentRequestDTO [accountId=" + accountId + ", investmentId=" + investmentId + ", amount="
				+ amount + "]";
	}
    
    

   
}
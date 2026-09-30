package com.fingenie.wealth_service.dto;

public class UserInvestmentResponseDTO {
	
	private Long id;
    private Long accountId;
    private Long userId;
    private String name;
    private String investmentType;
    private Double amount;

    public UserInvestmentResponseDTO() {}

	public UserInvestmentResponseDTO(Long id, Long accountId, Long userId, String name, String investmentType,
			Double amount) {
		super();
		this.id = id;
		this.accountId = accountId;
		this.userId = userId;
		this.name = name;
		this.investmentType = investmentType;
		this.amount = amount;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInvestmentType() {
		return investmentType;
	}

	public void setInvestmentType(String investmentType) {
		this.investmentType = investmentType;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	@Override
	public String toString() {
		return "UserInvestmentResponseDTO [id=" + id + ", accountId=" + accountId + ", userId=" + userId + ", name="
				+ name + ", investmentType=" + investmentType + ", amount=" + amount + "]";
	}

	

    
}
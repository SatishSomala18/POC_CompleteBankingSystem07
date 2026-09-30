package com.fingenie.banking_service.DTO;


public class AccountDTO {

	private long userId;
	private String accType;
	
	
	public AccountDTO() {
		super();
		// TODO Auto-generated constructor stub
	}


	public AccountDTO(long userId, String accType) {
		super();
		this.userId = userId;
		this.accType = accType;
	}


	public long getUserId() {
		return userId;
	}


	public void setUserId(long userId) {
		this.userId = userId;
	}




	public String getAccType() {
		return accType;
	}


	public void setAccType(String accType) {
		this.accType = accType;
	}


	@Override
	public String toString() {
		return "AccountDTO [userId=" + userId + ", accType=" + accType + "]";
	}



	

}

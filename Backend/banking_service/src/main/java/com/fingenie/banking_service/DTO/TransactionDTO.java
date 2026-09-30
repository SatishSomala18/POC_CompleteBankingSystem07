package com.fingenie.banking_service.DTO;

public class TransactionDTO {
	
	private long id;
	
	private double amount;
	
	private String type;
	
	private String category;

	public TransactionDTO(long id, double amount, String type, String category) {
		super();
		this.id = id;
		this.amount = amount;
		this.type = type;
		this.category = category;
	}

	public TransactionDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Override
	public String toString() {
		return "TransactionDTO [id=" + id + ", amount=" + amount + ", type=" + type + ", category=" + category + "]";
	}
	
	
	

}

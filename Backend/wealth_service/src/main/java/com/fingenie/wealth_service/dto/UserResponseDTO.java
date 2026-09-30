package com.fingenie.wealth_service.dto;

public class UserResponseDTO {

	private Long id;

	private String name;

	private String email;

	private String roles;

	private String phone;

	private Integer creditScore;

	private double monthlyIncome;

	public UserResponseDTO() {

	}

	public UserResponseDTO(Long id, String name, String email, String roles, String phone, Integer creditScore,
			double monthlyIncome) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.roles = roles;
		this.phone = phone;
		this.creditScore = creditScore;
		this.monthlyIncome = monthlyIncome;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getCreditScore() {
		return creditScore;
	}

	public void setCreditScore(Integer creditScore) {
		this.creditScore = creditScore;
	}

	public double getMonthlyIncome() {
		return monthlyIncome;
	}

	public void setMonthlyIncome(double monthlyIncome) {
		this.monthlyIncome = monthlyIncome;
	}

	@Override
	public String toString() {
		return "UserResponseDTO [id=" + id + ", name=" + name + ", email=" + email + ", roles=" + roles + ", phone="
				+ phone + ", creditScore=" + creditScore + ", monthlyIncome=" + monthlyIncome + "]";
	}

}

package test.data.manager.github.connectivity.pojo;

import java.util.ArrayList;

public class TestDataRepositoryRequestBody {

	private String testDataObject;

	private String testDataObjectAPI;

	private String releaseVersion;

	private String comments;

	private ArrayList<TestDataMeta> testDataMeta;

	private String testData;

	private String reviewers;

	public String getTestDataObject() {
		return testDataObject;
	}

	public void setTestDataObject(String testDataObject) {
		this.testDataObject = testDataObject;
	}

	public String getTestDataObjectAPI() {
		return testDataObjectAPI;
	}

	public void setTestDataObjectAPI(String testDataObjectAPI) {
		this.testDataObjectAPI = testDataObjectAPI;
	}

	public String getReleaseVersion() {
		return releaseVersion;
	}

	public void setReleaseVersion(String releaseVersion) {
		this.releaseVersion = releaseVersion;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public ArrayList<TestDataMeta> getTestDataMeta() {
		return testDataMeta;
	}

	public void setTestDataMeta(ArrayList<TestDataMeta> testDataMeta) {
		this.testDataMeta = testDataMeta;
	}

	public String getTestData() {
		return testData;
	}

	public void setTestData(String testData) {
		this.testData = testData;
	}

	public String getReviewers() {
		return reviewers;
	}

	public void setReviewers(String reviewers) {
		this.reviewers = reviewers;
	}

}

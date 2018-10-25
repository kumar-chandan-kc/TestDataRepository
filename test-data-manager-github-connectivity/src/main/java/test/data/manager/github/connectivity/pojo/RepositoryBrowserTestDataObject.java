package test.data.manager.github.connectivity.pojo;

import java.util.ArrayList;

public class RepositoryBrowserTestDataObject {

	private String testDataObject;

	private ArrayList<RepositoryBrowserTestDataObjectAPI> apiDetails = new ArrayList<RepositoryBrowserTestDataObjectAPI>();

	public String getTestDataObject() {
		return testDataObject;
	}

	public void setTestDataObject(String testDataObject) {
		this.testDataObject = testDataObject;
	}

	public ArrayList<RepositoryBrowserTestDataObjectAPI> getApiDetails() {
		return apiDetails;
	}

	public void setApiDetails(ArrayList<RepositoryBrowserTestDataObjectAPI> apiDetails) {
		this.apiDetails = apiDetails;
	}

	public void addApiDetail(RepositoryBrowserTestDataObjectAPI apiDetail) {
		this.apiDetails.add(apiDetail);
	}

}

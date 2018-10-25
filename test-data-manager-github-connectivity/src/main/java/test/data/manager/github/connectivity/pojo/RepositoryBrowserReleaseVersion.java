package test.data.manager.github.connectivity.pojo;

import java.util.ArrayList;

public class RepositoryBrowserReleaseVersion {

	private String releaseVersion;

	private ArrayList<String> keyFields = new ArrayList<String>();

	private ArrayList<RepositoryBrowserTestDataInstance> testDataInstances = new ArrayList<RepositoryBrowserTestDataInstance>();

	public String getReleaseVersion() {
		return releaseVersion;
	}

	public void setReleaseVersion(String releaseVersion) {
		this.releaseVersion = releaseVersion;
	}

	public ArrayList<String> getKeyFields() {
		return keyFields;
	}

	public void setKeyFields(ArrayList<String> keyFields) {
		this.keyFields = keyFields;
	}

	public ArrayList<RepositoryBrowserTestDataInstance> getTestDataInstances() {
		return testDataInstances;
	}

	public void setTestDataInstances(ArrayList<RepositoryBrowserTestDataInstance> testDataInstances) {
		this.testDataInstances = testDataInstances;
	}

}

package test.data.manager.github.connectivity.pojo;

import java.util.ArrayList;

public class RepositoryBrowserTestDataObjectAPI {

	private String testDataObjectAPI;

	private ArrayList<RepositoryBrowserReleaseVersion> releaseVersions = new ArrayList<RepositoryBrowserReleaseVersion>();

	public String getTestDataObjectAPI() {
		return testDataObjectAPI;
	}

	public void setTestDataObjectAPI(String testDataObjectAPI) {
		this.testDataObjectAPI = testDataObjectAPI;
	}

	public ArrayList<RepositoryBrowserReleaseVersion> getReleaseVersions() {
		return releaseVersions;
	}

	public void setReleaseVersions(ArrayList<RepositoryBrowserReleaseVersion> releaseVersions) {
		this.releaseVersions = releaseVersions;
	}

	public void addReleaseVersion(RepositoryBrowserReleaseVersion releaseVersion) {
		this.releaseVersions.add(releaseVersion);
	}

}

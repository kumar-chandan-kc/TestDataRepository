package test.data.manager.onprem.connectivity.pojo;

public class TestDataDeployerRequestBody {

	private String testDataObject;

	private String testDataObjectAPI;

	private String releaseVersion;

	private String testDataObjectFileName;

	private String systemToDeploy;

	private String systemClientToDeploy;

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

	public String getTestDataObjectFileName() {
		return testDataObjectFileName;
	}

	public void setTestDataObjectFileName(String testDataObjectFileName) {
		this.testDataObjectFileName = testDataObjectFileName;
	}

	public String getSystemToDeploy() {
		return systemToDeploy;
	}

	public void setSystemToDeploy(String systemToDeploy) {
		this.systemToDeploy = systemToDeploy;
	}

	public String getSystemClientToDeploy() {
		return systemClientToDeploy;
	}

	public void setSystemClientToDeploy(String systemClientToDeploy) {
		this.systemClientToDeploy = systemClientToDeploy;
	}

}

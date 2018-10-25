package test.data.manager.github.connectivity.pojo;

public class RequestDetail {

	private String requestPayload;

	private TestDataRepositoryRequestBody testDataRepository;

	public String getRequestPayload() {
		return requestPayload;
	}

	public void setRequestPayload(String requestPayload) {
		this.requestPayload = requestPayload;
	}

	public TestDataRepositoryRequestBody getTestDataRepository() {
		return testDataRepository;
	}

	public void setTestDataRepository(TestDataRepositoryRequestBody testDataRepository) {
		this.testDataRepository = testDataRepository;
	}

}

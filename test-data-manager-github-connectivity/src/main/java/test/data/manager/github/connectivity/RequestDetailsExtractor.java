package test.data.manager.github.connectivity;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.IOUtils;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import test.data.manager.github.connectivity.pojo.RequestDetail;
import test.data.manager.github.connectivity.pojo.TestDataRepositoryRequestBody;

public class RequestDetailsExtractor {

	private static final Logger LOGGER = LoggerFactory.getLogger(RequestDetailsExtractor.class);

	public static RequestDetail extractAndFetchRequestDetails(HttpServletRequest request) throws Exception {
		RequestDetail requestDetail = new RequestDetail();
		RequestDetailsExtractor.validateRequest(request.getRequestURI());
		requestDetail.setRequestPayload(IOUtils.toString(request.getInputStream()));
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		TestDataRepositoryRequestBody testDataRepositoryObject = mapper.readValue(requestDetail.getRequestPayload(),
				TestDataRepositoryRequestBody.class);
		requestDetail.setTestDataRepository(testDataRepositoryObject);
		return requestDetail;
	}

	public static void validateRequest(String requestPath) throws Exception {
		if (requestPath.isEmpty() || requestPath.split("/").length != 2
				|| !requestPath.split("/")[1].equals("testdata"))
			throw new Exception("request type unknown");
	}

}
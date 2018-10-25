package test.data.manager.github.connectivity;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import test.data.manager.github.connectivity.pojo.ReviewerMailDetailRequestBody;
import test.data.manager.github.connectivity.pojo.TestDataRepositoryRequestBody;

public class MailSender {

	private static final Logger LOGGER = LoggerFactory.getLogger(MailSender.class);

	public static void sendTestDataReviewMail(TestDataRepositoryRequestBody testDataRepository, String sReviewUrl)
			throws Exception {
		LOGGER.info("sending mail started...");
		HttpURLConnection urlConnection = OnPremConnectivity.createRequestUsingConnectivityService(
				"http://onpremmachine:8090/test-data-manager-email-connectivity/", null, null);
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		ReviewerMailDetailRequestBody reviewerMail = new ReviewerMailDetailRequestBody();
		reviewerMail.setRecipients(testDataRepository.getReviewers());
		reviewerMail.setGithubPath(sReviewUrl);
		mapper.writeValue(outputStream, reviewerMail);
		outputStream.flush();
		outputStream.close();
		if (urlConnection.getResponseCode() == 201) {
			LOGGER.info("request sends 201");
		} else
			LOGGER.info(GitHubConnector.extractResponse(urlConnection));
		LOGGER.info("sending mail completed....");
	}
}

package test.data.manager.email.connectivity;

import java.io.IOException;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import test.data.manager.email.connectivity.pojo.EmailMessageRequestBody;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@WebServlet("/*")
public class EmailServerConnector extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {
			Properties props = new Properties();
			props.put("mail.smtp.host", "mail.sap.corp");
			props.put("mail.smtp.port", "25");
			Session session = Session.getInstance(props, null);

			EmailMessageRequestBody emailDetails = this.extractAndFetchRequestDetails(request);
			if (emailDetails.getRecipients().isEmpty() || emailDetails.getGithubPath().isEmpty())
				throw new Exception("mandatory details not sent for sending email");

			MimeMessage msg = new MimeMessage(session);
			msg.addHeader("Content-type", "text/HTML; charset=UTF-8");

			msg.setFrom(new InternetAddress("chandan.kumar.kakani@sap.com"));

			msg.setSubject("Test Data Object - Review Required", "UTF-8");
			String sBody = "Hi,<br>You have been added as a reviewer for the below test data object. Kindly review by clicking on the link.<br>";
			sBody = sBody + emailDetails.getGithubPath();
			msg.setContent(sBody, "text/html");
			msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailDetails.getRecipients(), false));
			Transport.send(msg);
		} catch (Exception e) {
			response.getWriter().write(e.toString());
			response.setStatus(500);
		}
	}

	private EmailMessageRequestBody extractAndFetchRequestDetails(HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		EmailMessageRequestBody emailDetails = mapper.readValue(
				request.getReader().lines().collect(Collectors.joining(System.lineSeparator())),
				EmailMessageRequestBody.class);
		return emailDetails;
	}

}

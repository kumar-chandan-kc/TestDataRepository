package test.data.manager.github.connectivity;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Base64;

import org.cloudfoundry.identity.client.UaaContext;
import org.cloudfoundry.identity.client.UaaContextFactory;
import org.cloudfoundry.identity.client.token.GrantType;
import org.cloudfoundry.identity.client.token.TokenRequest;
import org.cloudfoundry.identity.uaa.oauth.token.CompositeAccessToken;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

public class OnPremConnectivity {

	private static final Logger LOGGER = LoggerFactory.getLogger(OnPremConnectivity.class);

	public static HttpURLConnection createRequestUsingConnectivityService(String requestURL, String username,
			String password) throws JSONException, IOException {

		LOGGER.info("fetching of environment variables with credentials began");
		final String vcap_services = System.getenv("VCAP_SERVICES");
		JSONObject jsonObj = new JSONObject(vcap_services);
		JSONArray connectivyNode = jsonObj.getJSONArray("connectivity");
		JSONObject connectivityCredentials = connectivyNode.getJSONObject(0).getJSONObject("credentials");
		LOGGER.info("environment variables with credentials fetched");

		LOGGER.info("checkpoint 5: connection object to the virtual endpoint creation began");
		final String onpremise_proxy_host = connectivityCredentials.getString("onpremise_proxy_host");
		final String onpremise_proxy_port = connectivityCredentials.getString("onpremise_proxy_port");
		Proxy proxy = new Proxy(Proxy.Type.HTTP,
				new InetSocketAddress(onpremise_proxy_host, Integer.parseInt(onpremise_proxy_port)));
		final URL url = new URL(requestURL);
		HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection(proxy);
		LOGGER.info("checkpoint 6: connection object to the virtual endpoint is created with connectivity proxy");

		LOGGER.info("checkpoint 7: xsuaa url fetch and creating new URI object began");
		String clientid = connectivityCredentials.getString("clientid");
		String clientsecret = connectivityCredentials.getString("clientsecret");
		URI xsuaaUrl = null;
		try {
			xsuaaUrl = new URI(connectivityCredentials.getString("url"));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		LOGGER.info("checkpoint 8: xsuaa url fetch and creating new URI object done");

		LOGGER.info("checkpoint 8: JWT token fetch with connectivity credentials began");
		UaaContextFactory factory = UaaContextFactory.factory(xsuaaUrl).authorizePath("/oauth/authorize")
				.tokenPath("/oauth/token");
		TokenRequest tokenRequest = factory.tokenRequest();
		tokenRequest.setGrantType(GrantType.CLIENT_CREDENTIALS);
		tokenRequest.setClientId(clientid);
		tokenRequest.setClientSecret(clientsecret);
		UaaContext xsuaaContext = factory.authenticate(tokenRequest);
		CompositeAccessToken accessToken = xsuaaContext.getToken();
		urlConnection.setRequestProperty("Proxy-Authorization", "Bearer " + accessToken);
		LOGGER.info("checkpoint 9: JWT token fetch with connectivity credentials done");

		LOGGER.info("checkpoint 10: SAP-connectivity-Authentication token set began");
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) auth.getDetails();
		String jwtToken2 = details.getTokenValue();
		urlConnection.setRequestProperty("SAP-Connectivity-Authentication", "Bearer " + jwtToken2);
		LOGGER.info("checkpoint 11: SAP-connectivity-Authentication token set done");

		LOGGER.info("checkpoint 12: sending request to backend began");
		if (username != null && password != null)
			urlConnection.setRequestProperty("Authorization",
					"Basic " + Base64.getEncoder().encodeToString((username + ":" + password).getBytes()));
		LOGGER.info("checkpoint 13: sending request to backend done. response received");
		return urlConnection;
	}

}

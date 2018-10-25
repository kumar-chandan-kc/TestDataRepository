package test.data.manager.onprem.connectivity;

import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;

import javax.servlet.http.HttpServletRequest;

import org.cloudfoundry.identity.client.UaaContext;
import org.cloudfoundry.identity.client.UaaContextFactory;
import org.cloudfoundry.identity.client.token.GrantType;
import org.cloudfoundry.identity.client.token.TokenRequest;
import org.cloudfoundry.identity.uaa.oauth.token.CompositeAccessToken;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

public class OnPremRequestUtils {

	private static final Logger LOGGER = LoggerFactory.getLogger(OnPremRequestUtils.class);
	private static final String[] ALLOWED_HEADERS_IN = new String[] { "accept", "accept-language", "dataserviceversion",
			"maxdataserviceversion", "content-length", "content-type", "x-csrf-token", "cookie" };

	public static String fetchVirtualUrl(HttpServletRequest request) {
		LOGGER.info("odata service data fetch began");
		final String requestUrl = request.getRequestURI();
		final String requestParams = request.getQueryString();
		final String onPremSystemToConnect = requestUrl.split("/")[1];
		final String onPremSystemVirtualHost = OnPremSystems.systemsMap.get(onPremSystemToConnect);
		final String virtualUrl = (requestParams != null)
				? "http://" + onPremSystemVirtualHost + requestUrl.replace("/" + onPremSystemToConnect, "") + "?"
						+ requestParams
				: "http://" + onPremSystemVirtualHost + requestUrl.replace("/" + onPremSystemToConnect, "");
		LOGGER.info("url request is : " + virtualUrl);
		return virtualUrl;
	}

	public static HttpURLConnection fetchUrlConnection(String virtualUrl) throws Exception {
		LOGGER.info("fetching of environment variables with credentials began");
		final String vcap_services = System.getenv("VCAP_SERVICES");
		JSONObject jsonObj = new JSONObject(vcap_services);
		JSONArray connectivyNode = jsonObj.getJSONArray("connectivity");
		JSONObject connectivityCredentials = connectivyNode.getJSONObject(0).getJSONObject("credentials");
		LOGGER.info("environment variables with credentials fetched");

		LOGGER.info("connection object to the virtual endpoint creation began");
		final String onpremise_proxy_host = connectivityCredentials.getString("onpremise_proxy_host");
		final String onpremise_proxy_port = connectivityCredentials.getString("onpremise_proxy_port");
		Proxy proxy = new Proxy(Proxy.Type.HTTP,
				new InetSocketAddress(onpremise_proxy_host, Integer.parseInt(onpremise_proxy_port)));
		final URL url = new URL(virtualUrl);
		HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection(proxy);
		LOGGER.info("connection object to the virtual endpoint is created with connectivity proxy");

		LOGGER.info("xsuaa url fetch and creating new URI object began");
		String clientid = connectivityCredentials.getString("clientid");
		String clientsecret = connectivityCredentials.getString("clientsecret");
		URI xsuaaUrl = null;
		try {
			xsuaaUrl = new URI(connectivityCredentials.getString("url"));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		LOGGER.info("xsuaa url fetch and creating new URI object done");

		LOGGER.info("JWT token fetch with connectivity credentials began");
		UaaContextFactory factory = UaaContextFactory.factory(xsuaaUrl).authorizePath("/oauth/authorize")
				.tokenPath("/oauth/token");
		TokenRequest tokenRequest = factory.tokenRequest();
		tokenRequest.setGrantType(GrantType.CLIENT_CREDENTIALS);
		tokenRequest.setClientId(clientid);
		tokenRequest.setClientSecret(clientsecret);
		UaaContext xsuaaContext = factory.authenticate(tokenRequest);
		CompositeAccessToken accessToken = xsuaaContext.getToken();
		urlConnection.setRequestProperty("Proxy-Authorization", "Bearer " + accessToken);
		LOGGER.info("JWT token fetch with connectivity credentials done");

		LOGGER.info("SAP-connectivity-Authentication token set began");
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) auth.getDetails();
		String jwtToken2 = details.getTokenValue();
		urlConnection.setRequestProperty("SAP-Connectivity-Authentication", "Bearer " + jwtToken2);
		LOGGER.info("SAP-connectivity-Authentication token set done");
		return urlConnection;
	}

	public static void addWhitelistedHeaders(HttpServletRequest request, HttpURLConnection urlConnection) {
		for (String key : Collections.list(request.getHeaderNames())) {
			if (Arrays.asList(ALLOWED_HEADERS_IN).indexOf(key.toLowerCase()) > 0)
				urlConnection.setRequestProperty(key, request.getHeader(key));
		}
	}

	public static void addAuthorization(HttpURLConnection urlConnection, String systemToDeploy) {
		urlConnection.setRequestProperty("Authorization",
				"Basic " + Base64.getEncoder().encodeToString((OnPremSystems.systemsUsers.get(systemToDeploy) + ":"
						+ OnPremSystems.systemsPassword.get(systemToDeploy)).getBytes()));
	}

}

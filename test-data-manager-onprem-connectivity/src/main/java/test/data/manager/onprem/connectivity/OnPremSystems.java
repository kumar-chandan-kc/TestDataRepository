package test.data.manager.onprem.connectivity;

import java.util.HashMap;

public class OnPremSystems {

	public static HashMap<String, String> systemsMap = new HashMap<String, String>() {

		private static final long serialVersionUID = 4936252696776179078L;

		{
			put("er6", "er6:443");
			put("uyt", "uyt:443");
			put("cc2", "cc2:443");
		}
	};

	public static HashMap<String, String> systemsUsers = new HashMap<String, String>() {

		private static final long serialVersionUID = 4936252696776179078L;

		{
			put("er6", "username");
			put("uyt", "username");
			put("cc2", "username");
		}
	};

	public static HashMap<String, String> systemsPassword = new HashMap<String, String>() {

		private static final long serialVersionUID = 4936252696776179078L;

		{
			put("er6", "password");
			put("uyt", "password");
			put("cc2", "password");
		}
	};

}

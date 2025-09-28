export const skillbadges: App.JuaraBadge[] = [
	{
		courseid: 976,
		title: 'Prompt Design in Vertex AI',
		required: true
	},
	{
		courseid: 1076,
		title: 'Build Real World AI Applications with Gemini and Imagen'
	},
	{
		courseid: 700,
		title: 'Cloud Speech API: 3 Ways'
	},
	{
		courseid: 631,
		title: 'Prepare Data for ML APIs on Google Cloud'
	},
	{
		courseid: 674,
		title: 'Automate Data Capture at Scale with Document AI'
	},
	{
		courseid: 630,
		title: 'Use Machine Learning APIs on Google Cloud'
	},
	{
		courseid: 684,
		title: 'Build and Deploy Machine Learning Solutions on Vertex AI'
	},
	{
		courseid: 686,
		title: 'Build Custom Processors with Document AI'
	},
	{
		courseid: 978,
		title: 'Develop GenAI Apps with Gemini and Streamlit'
	},
	{
		courseid: 959,
		title: 'Explore Generative AI with the Vertex AI Gemini API'
	},
	{
		courseid: 981,
		title: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG'
	},
	{
		courseid: 754,
		title: 'The Basics of Google Cloud Compute'
	},
	{
		courseid: 751,
		title: 'Secure BigLake Data'
	},
	{
		courseid: 1164,
		title: 'Secure Software Delivery'
	},
	{
		courseid: 750,
		title: 'Get Started with Sensitive Data Protection'
	}
].map((b) => ({ ...b, type: 'skill' }));

export const regularbadges: App.JuaraBadge[] = [
	{
		courseid: 1169,
		title: 'Boost Productivity with Gemini in BigQuery'
	},
	{
		courseid: 879,
		title: 'Gemini for Data Scientists and Analysts'
	},
	{
		courseid: 156,
		title: 'Google Cloud Computing Foundations: Data, ML, and AI in Google Cloud'
	},
	{
		courseid: 735,
		title: 'Google Developer Essentials'
	},
	{
		courseid: 9,
		title: 'Machine Learning in the Enterprise'
	},
	{
		courseid: 506,
		title: 'Modernizing Retail and Ecommerce Solutions with Google Cloud'
	},
	{
		courseid: 781,
		title: 'Workspace: Add-ons'
	},
	{
		courseid: 738,
		title: 'Intermediate ML: TensorFlow on Google Cloud'
	},
	{
		courseid: 666,
		title: 'Advanced ML: ML Infrastructure'
	},
	{
		courseid: 1036,
		title: 'Responsible AI for Developers: Privacy & Safety'
	},
	{
		courseid: 1133,
		title: 'Work with Gemini Models in BigQuery'
	},
	{
		courseid: 25,
		title: 'Achieving Advanced Insights with BigQuery'
	}
].map((b) => ({ ...b, type: 'completion' }));

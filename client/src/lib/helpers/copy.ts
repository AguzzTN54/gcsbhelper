export const copyToClipboard = (text: string) => {
	if (navigator.clipboard && window.isSecureContext) {
		return navigator.clipboard.writeText(text);
	} else {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		try {
			document.execCommand('copy');
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		} finally {
			document.body.removeChild(textarea);
		}
	}
};

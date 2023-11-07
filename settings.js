if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(str, newStr){
		if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
			return this.replace(str, newStr);
		}
		return this.replace(new RegExp(str, 'g'), newStr);
	};
}

if (!String.prototype.split) {
	String.prototype.split = function(separator) {
		const result = [];
		let startIndex = 0;
		let separatorIndex = this.indexOf(separator);
		while (separatorIndex !== -1) {
			result.push(this.slice(startIndex, separatorIndex));
			startIndex = separatorIndex + separator.length;
			separatorIndex = this.indexOf(separator, startIndex);
		}
		result.push(this.slice(startIndex));
		return result;
	};
}

module.exports = true;
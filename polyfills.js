if(!Date.SQL) {
	Date.prototype.SQL = function () {
		return this.getFullYear() + "-" + (this.getMonth() + 1).toString().padStart(2, "0") + "-" + this.getDate().toString().padStart(2, "0") + " " + this.getHours().toString().padStart(2, "0") + ":" + this.getMinutes().toString().padStart(2, "0") + ":" + this.getSeconds().toString().padStart(2, "0");
	}
}

if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function (str, newStr) {
		if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
			return this.replace(str, newStr);
		}
		return this.replace(new RegExp(str, 'g'), newStr);
	};
}

if (!String.prototype.split) {
	String.prototype.split = function (separator) {
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

if (!Array.prototype.at) {
	Array.prototype.at = function (index) {
		const length = this.length;
		index = index < 0 ? length + index : index;
		return index >= 0 && index < length ? this[index] : undefined;
	};
}

if (!global.structuredClone) {
	global.structuredClone = (val) => JSON.parse(JSON.stringify(val))
}

module.exports = true;
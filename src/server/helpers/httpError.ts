import statuses from 'statuses';

export default class HTTPError extends Error {
    status: number;
	constructor(status = 503, message: string) {
		if (!message) message = status + ' - ' + statuses(status);
		super(message);
		this.status = status;
	}
}
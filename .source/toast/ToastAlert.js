import { View } from '../base/View';

export class ToastAlert extends View
{
	constructor(args)
	{
		super(args);
		this.args.running = false;
		this.args.time    = this.args.time || 16000;
		this.init         = this.args.time;
		this.args.title   = this.args.title || 'Standard alert';
		this.args.status  = 'new';
		this.args.body    = this.args.body  || 'This is a standard alert.';
		this.template     = `
			<div id = "[[_id]]" class = "alert toast-[[status]]">
				<h3>[[title]]</h3>
				<p>[[body]]</p>
			</div>
		`;
	}

	decay(complete)
	{
		this.args.running = true;

		this.onTimeout(50, () => {
			this.args.status = '';
		});

		this.onTimeout(300, () => {
			this.args.status = 'decaying';
		});

		this.onTimeout(2400, () => {
			this.args.status = 'imminent';
		});

		this.onTimeout(3500, () => {
			this.remove();
		});
	}
}

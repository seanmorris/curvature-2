import { View } from '../base/View';

export class ToastAlert extends View {
	constructor(args) {
		super(args);
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
	decay(complete) {
		const  decayInterval = 50;

		const decayFunc = ()=>{
			if(this.args.time < 300 && this.args.status !== 'imminent') {
				// console.log(this.args.time);
				this.args.status = 'imminent';
			}
			else if(this.args.time > 1200 && this.args.status !== 'decaying'){
				// console.log(this.args.time);
				this.args.status = 'decaying';
			}
			if(this.args.time > 0) {
				this.args.time -= decayInterval;

				if(this.args.time <= 0) {
					if(complete) {
						complete();
					}
					clearInterval(decay);
				}
			}
		};

		let decay = setInterval(decayFunc, decayInterval);
	}
}

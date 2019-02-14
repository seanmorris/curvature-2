import { View } from '../base/View';

export class ToastAlert extends View {
	constructor(args) {
		super(args);
		this.args.time    = this.args.time || 16000;
		this.init         = this.args.time;
		this.args.opacity = 1;
		this.args.title   = this.args.title || 'Standard alert';
		this.args.status  = 'new';
		this.args.body    = this.args.body  || 'This is a standard alert.';
		this.template     = `
			<div id = "[[_id]]" style = "opacity:[[opacity]]" class = "alert toast-[[status]]">
				<h3>[[title]]</h3>
				<p>[[body]]</p>
			</div>
		`;
	}
	decay(complete) {
		let decayInterval = 16;
		let decay = setInterval(
			()=>{
				if(this.args.time < 300 && this.args.status !== 'imminent') {
					console.log(this.args.time);
					this.args.status = 'imminent';
				}
				else if(this.args.time > 300 && this.args.status !== 'decaying'){
					console.log(this.args.time);
					this.args.status = 'decaying';
				}
				if(this.args.time > 0) {
					this.args.time -= decayInterval;
					this.args.opacity = this.args.time / this.init;

					if(this.args.time <= 0) {
						if(complete) {
							complete();
						}
						clearInterval(decay);
					}					
				}
			}
			, decayInterval
		);
	}
}

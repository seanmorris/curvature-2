import { View } from '../base/View';
import { Bindable } from '../base/Bindable';
import { ToastAlert } from './ToastAlert';

export class Toast extends View {
	static instance() {
		if(!this.inst) {
			this.inst = new this();
		}
		return this.inst;
	}
	constructor() {
		super();
		this.template = `
			<div id = "[[_id]]" cv-each = "alerts:alert" class = "toast">
				[[alert]]
			</div>
		`;
		// this.style = {
		// 	'': {
		// 		position:   'fixed'
		// 		, top:      '0px'
		// 		, right:    '0px'
		// 		, padding:  '8px'
		// 		, 'z-index':'999999'
		// 		, display:  'flex'
		// 		, 'flex-direction': 'column-reverse'
		// 	}
		// };

		this.args.alerts = [];

		// this.args.alerts.bindTo((v) => { console.log(v) });
	}
	pop(alert) {
		let index = this.args.alerts.length;

		this.args.alerts.push(alert);

		alert.decay(((alert)=>()=>{
			for(let i in this.args.alerts)
			{
				if(Bindable.ref(this.args.alerts[i]) === Bindable.ref(alert))
				{
					alert.remove();
					delete this.args.alerts[i];
					return;
				}
			}
		})(alert));
	}
	alert(title, body, time) {
		return this.pop(new ToastAlert({
			title: title
			, body: body
			, time: time
		}));
	}
}

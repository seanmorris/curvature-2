export class Theme
{
	constructor()
	{
		this.views = {
			'SeanMorris\\TheWhtRbt\\Location' : {
				single: 'twr9/LocationPreview'
				, list: 'twr9/LocationList'
			}
			, 'SeanMorris\\TheWhtRbt\\Image' : {
				single: 'DetailView'
				, list: 'DetailListView'
			}
		};
	}

	resolve(model)
	{
		let modelClass;

		if(Array.isArray(model))
		{
			for(let i in model)
			{
				let _modelClass = model[i].class || model[i].content_type;

				if(modelClass && modelClass !== _modelClass)
				{
					throw new Error('Model list mismatch!');
				}
				else
				{
					modelClass = _modelClass;
				}
			}

			if(this.views[modelClass])
			{
				if(this.views[modelClass].list)
				{
					return this.views[modelClass].list;
				}

				return this.views[modelClass];
			}

			return 'DetailListView';
		}
		else if(model)
		{
			modelClass = model.class || model.content_type;

			if(this.views[modelClass])
			{
				if(this.views[modelClass].single)
				{
					return this.views[modelClass].single;
				}

				return this.views[modelClass];
			}

			return 'DetailView';
		}

		return false;
	}
}

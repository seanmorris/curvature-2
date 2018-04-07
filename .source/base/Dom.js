export class Dom
{
	static mapTags(doc, selector, callback, startNode, endNode)
	{
		let result = [];

		let started = true;

		if(startNode)
		{
			started = false;
		}

		let ended = false;

		var treeWalker = document.createTreeWalker(
			doc,
			NodeFilter.SHOW_ALL,
			{
				acceptNode: (node) => {
					if(!started)
					{
						if(node === startNode)
						{
							started = true;
						}
						else
						{
							return NodeFilter.FILTER_SKIP;
						}
					}
					if(endNode && node === endNode)
					{
						ended = true;
					}
					if(ended)
					{
						return NodeFilter.FILTER_SKIP;
					}
					if(selector)
					{
						// console.log(selector, node, !!(node instanceof Element));
						if(node instanceof Element)
						{
							if(node.matches(selector))
							{
								return NodeFilter.FILTER_ACCEPT;
							}
						}

						return NodeFilter.FILTER_SKIP;
					}

					return NodeFilter.FILTER_ACCEPT;
				}
			},
			false
		);

		while(treeWalker.nextNode())
		{
			result.push(callback(treeWalker.currentNode));
		}

		return result;
	}
	static dispatchEvent(doc, event)
	{
		doc.dispatchEvent(event);

		Dom.mapTags(doc, false, (node) => {
			node.dispatchEvent(event);
		});
	}
}
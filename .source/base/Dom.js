let traversals = 0;

export class Dom
{
	static mapTags(doc, selector, callback, startNode, endNode)
	{
		const result = [];

		let started = true;

		if(startNode)
		{
			started = false;
		}

		let ended = false;

		const treeWalker = document.createTreeWalker(
			doc,
			NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
			{
				acceptNode: (node, walker) => {

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

		const traversal = traversals++;

		while(treeWalker.nextNode())
		{
			result.push(callback(treeWalker.currentNode, treeWalker));
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

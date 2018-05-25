'use strict'

import { Bindable   } from 'base/Bindable';
import { Cache      } from 'base/Cache';
import { Cookie     } from 'base/Cookie';
import { Dom        } from 'base/Dom';
import { Repository } from 'base/Repository';
import { Router     } from 'base/Router';
import { Tag        } from 'base/Tag';
import { Theme      } from 'base/Theme';
import { View       } from 'base/View';

import { LoginView }      from 'access/LoginView';
import { UserRepository } from 'access/UserRepository';

import { ButtonField } from 'form/ButtonField';
import { Field       } from 'form/Field';
import { FieldSet    } from 'form/FieldSet';
import { FileField   } from 'form/FileField';
import { Form        } from 'form/Form';
import { HiddenField } from 'form/HiddenField';
import { HtmlField   } from 'form/HtmlField';
import { SelectField } from 'form/SelectField';

import { PopOutTag } from 'tag/PopOutTag';
import { ScrollTag } from 'tag/ScrollTag';

import { Toast      } from 'toast/Toast';
import { ToastAlert } from 'toast/ToastAlert';

let base = {
	Bindable
	, Cache
	, Cookie
	, Dom
	, Repository
	, Router
	, Tag
	, Theme
	, View
}

let access = {
	LoginView
	, UserRepository
};

let form = {
	ButtonField
	, Field
	, FieldSet
	, FileField
	, Form
	, HiddenField
	, HtmlField
	, SelectField
};

let tag = {
	PopOutTag
	, ScrollTag
};

let toast = {
	Toast
	, ToastAlert
};

export { base, access, form, tag, toast };